import * as mongoose from 'mongoose';

/**
 * Record, which keep name and testId until we will receive test result
 */
export interface TestWaiterRecord {
    testId: string;
    did: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sDateOfBirth: string;
    expirationDate: Date;
}


const TestWaiterSchema = new mongoose.Schema({
  testId: { type: String, unique: true, required: true, index: true  },
  did: { type: String  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  sDateOfBirth: { type: String, required: true },
  expirationDate: { type: Date }
 },{
  strict: false
});

TestWaiterSchema.statics.findByTestId = async (testId:string): Promise<TestWaiterDocument> => {
  const r = await TestWaiterModel.findOne({testId}).exec();
  if (r === null) {
    return undefined;
  } else {
    return r;
  }
};

TestWaiterSchema.statics.createRecord = async (record: TestWaiterRecord): Promise<TestWaiterDocument> => {
   return TestWaiterModel.create(record);
};

TestWaiterSchema.statics.delete = async(did: string): Promise<boolean> => {
  const r =  await TestWaiterModel.deleteOne({did}).exec();
  return r.n > 0;
};


export interface TestWaiterDocument extends TestWaiterRecord, mongoose.Document {
}

export interface ITestWaiterModel extends mongoose.Model<TestWaiterDocument> {
   
  findByTestId(testId:string): Promise<TestWaiterDocument>;

  createRecord(record: TestWaiterRecord): Promise<TestWaiterDocument>;

  delete(did: string): Promise<boolean>;

}

export const TestWaiterModel = mongoose.model<TestWaiterDocument,ITestWaiterModel>(
  "TestWaiter",
   TestWaiterSchema
);

