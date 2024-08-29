import { BadRequestException, Body, Controller, Param, Get, Query, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { query } from 'express';


// @Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
    constructor( private reportService: ReportsService){}

    @Get()
    @UseGuards(AuthGuard)
    getEstimate(@Query() query: GetEstimateDto){
        return this.reportService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body:CreateReportDto, @CurrentUser() user :User) {
        return this.reportService.create(body, user)

    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        if(!id) throw new BadRequestException('Id not found')
        return this.reportService.changeApproval(Number(id), body.approved);
    }
}
