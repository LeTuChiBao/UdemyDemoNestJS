
import { Report } from "../reports/report.entity";
import { AfterInsert,AfterRemove,AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
    
    @Column({default: false})
    admin: boolean;

    // @AfterInsert()
    // logInsert(){
    //     console.log('Inserted User with Id', this.id);
    // }
    @OneToMany(()=> Report, (report)=> report.user)
    reports: Report[];

    // @AfterUpdate()
    // logUpdate(){
    //     console.log('Updated User with id',this.id);
    // }

    // @AfterRemove()
    // logRemove(){
    //     console.log('Removed User with id',this.id);
    // }

   
}