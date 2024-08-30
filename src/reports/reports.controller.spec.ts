import { query } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { User } from 'src/users/user.entity';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { report } from 'process';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportService : Partial<ReportsService>;
  const reports = [
    {
      id: 1,
      make: "ford",
      model: "mustang",
      year: 2013,
      mileage: 25000,
      long: 35,
      lat: 40,
      price: 35000,
      approved: false,
      user:{ id: 1, email: "user2@example.com" }
    },
    {
      id: 2,
      make: "ford",
      model: "mustang",
      year: 2013,
      mileage: 20000,
      long: 40,
      lat: 45,
      price: 40000,
      approved: true,
      user:{ id: 1, email: "user2@example.com" }
    }
  ];

  beforeEach(async () => {
    fakeReportService = {
      create:(body: CreateReportDto, user: Partial<User>)=> {
        const report= {
          id: reports.length + 1,
          make: body.make,
          model: body.model,
          year:  body.year,
          mileage: body.mileage,
          long: body.long,
          lat: body.lat,
          price: body.price,
          approved:false,
          user: {
            id:user.id,
            email: user.email
          }
        }  as Report;

        reports.push(report);
        return Promise.resolve(report);
      },
      changeApproval: (id: number, approved: boolean)=> {
        const report = reports[2] as Report;
        report.approved = approved;
        return Promise.resolve(report)
      },

      createEstimate: ({make, model,year,lat,long, mileage}:GetEstimateDto)=> {
        const datareport = reports.filter(report=> {
          return report.make === make &&
          report.model === model &&
          Math.abs(report.year-year)<=3 &&
          Math.abs(report.lat - lat ) <=5 &&
          Math.abs(report.long - long)<=5 &&
          report.approved === true 
        })
        const dataDistance = datareport.map(report=> ({
          ...report,
          distance: Math.abs(report.mileage - mileage)
          
        }))
        const sortdata = dataDistance.sort((a, b)=> a.distance- b.distance) // DESC ngược lại b - a

        if (sortdata[0]) {
          return Promise.resolve({ price: sortdata[0].price });
        } else {
          return Promise.resolve({ price: null ,  reason: "Query values data not found"});
        }
      }

    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{
        provide: ReportsService,
        useValue: fakeReportService
      }]
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('Report controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('reportController create Post with perfect data ',async () => {
    const carinfo = {
        make: "ford",
        model: "mustang",
        year:  2013,
        mileage: 45000,
        long: 40,
        lat: 45,
        price: 35000
    }
    const user = {
      id:1,
      email: 'test@email.com',
      password: '123456',
      admin: true,
      reports: []
    }
    const report = await controller.createReport(carinfo,user);
    expect(report.id).toBe(3);
    expect(report.make).toEqual(carinfo.make);
    expect(report.model).toEqual(carinfo.model);
    expect(report.approved).toBeFalsy();
    expect(report.user.id).toEqual(user.id);
    expect(report.user.password).not.toBeDefined()
    expect(reports.length).toBeGreaterThan(0)
  });

  it('reportController changeApproval send data with id null ',async () => {
    const body:ApproveReportDto = {
      approved: true
    }
    try {
      await controller.approvedReport('',body)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toBe('Id not found')
    }
  });

  it('reportController changeApproval approved data success ',async () => {
    const body:ApproveReportDto = {
      approved: true
    }
    const report = await controller.approvedReport('1',body)
    expect(report.approved).toBe(true)

  });

  it('reportController getEstimate data sucess',async ()=> {
    
    const dataquery:GetEstimateDto = {
      make: "ford",
      model: "mustang",
      year:  2013,
      mileage: 30000,
      long: 40,
      lat: 45
    }
    const response = await controller.getEstimate(dataquery);
    expect(response).toBeDefined();
    expect(response.price).toEqual(40000);

  })

  it('reportController getEstimate not found data',async ()=> {
    
    const dataquery:GetEstimateDto = {
      make: "abcd",
      model: "mustang",
      year:  2013,
      mileage: 30000,
      long: 40,
      lat: 45
    }
    try {
      await controller.getEstimate(dataquery);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Query values data not found');
    }

  })
});
