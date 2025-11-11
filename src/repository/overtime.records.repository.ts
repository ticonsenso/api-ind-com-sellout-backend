import {OvertimeRecord} from '../models/overtime.records.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class OvertimeRecordsRepository extends BaseRepository<OvertimeRecord> {
  constructor(dataSource: TypeORMDataSource) {
    super(OvertimeRecord, dataSource);
  }
}
