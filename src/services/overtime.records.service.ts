import {DataSource} from 'typeorm';
import {OvertimeRecordsRepository} from '../repository/overtime.records.repository';

export class OvertimeRecordsService {
  private overtimeRecordRepository: OvertimeRecordsRepository;

  constructor(dataSource: DataSource) {
    this.overtimeRecordRepository = new OvertimeRecordsRepository(dataSource);
  }
}
