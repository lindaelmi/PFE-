// src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepository: Repository<ContactMessage>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactMessage> {
    const message = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(message);
  }

  // Optionnel: ajouter plus tard
  // async findAll(): Promise<ContactMessage[]> {
  //   return await this.contactRepository.find({ 
  //     order: { createdAt: 'DESC' },
  //     take: 50 
  //   });
  // }
}