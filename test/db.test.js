import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import dbconfig from '../dbconfig';

describe('Database Configuration', () => {
  it('should connect to MongoDB', async () => {
    const connectStub = sinon.stub(mongoose, 'connect').resolves();
    await dbconfig();
    expect(connectStub.calledOnce).to.be.true;
    connectStub.restore();
  });

  it('should handle MongoDB connection error', async () => {
    const connectStub = sinon.stub(mongoose, 'connect').rejects(new Error('Connection error'));
    try {
      await dbconfig();
    } catch (error) {
      expect(error.message).to.equal('Connection error');
    }
    connectStub.restore();
  });
});
