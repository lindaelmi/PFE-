import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Créer un admin par défaut
  const adminExists = await userRepository.findOne({ where: { email: 'admin@lilibooking.com' } });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      email: 'admin@lilibooking.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'LILIBooking',
      role: 'admin',
      language: 'fr',
      phone: '+33123456789',
    });
    await userRepository.save(admin);
    console.log('Admin user created');
  }

  // Créer un utilisateur test
  const userExists = await userRepository.findOne({ where: { email: 'user@test.com' } });
  
  if (!userExists) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    const user = userRepository.create({
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      language: 'en',
      phone: '+33198765432',
    });
    await userRepository.save(user);
    console.log('Test user created');
  }

  console.log('Database seeded successfully');
}