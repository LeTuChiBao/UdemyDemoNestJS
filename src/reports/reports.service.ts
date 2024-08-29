import { query } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { Long, Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private reportRepository: Repository<Report>
    ){}

    async createEstimate({make, model,year,lat,long, mileage}:GetEstimateDto){
        return this.reportRepository.createQueryBuilder()
            .select('AVG(price)','price')
            .where('make = :make', { make})
            .andWhere('model= :model', {model})
            .andWhere('long - :long BETWEEN -5 AND 5', {long})
            .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
            .andWhere('year - :year BETWEEN -3 AND 3', {year})
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({mileage})
            .limit(3)
            .getRawOne()
    }

    async create(reportDto: CreateReportDto, user: User) {
        const report = await this.reportRepository.create(reportDto);
        report.user = user;
        return await this.reportRepository.save(report);
    }

    async changeApproval(id: number, approved: boolean) {
        const report = await this.reportRepository.findOneBy({id});
        if(!report) throw new NotFoundException('Report not found')
        report.approved = approved;
        return await this.reportRepository.save(report)
        
    }
}
