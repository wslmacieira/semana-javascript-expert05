import { describe, test, expect, jest } from "@jest/globals";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";
import fs from 'fs'
import { resolve } from 'path'

describe('#UploadHandler test suite', () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => { }
  }

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on Busboy instance', () => {
      const uplodaHandler = new UploadHandler({
        io: ioObj,
        sockeId: '01'
      })

      jest.spyOn(uplodaHandler, uplodaHandler.onFile.name)
        .mockReturnValue()

      const headers = {
        'content-type': 'multipart/form-data; boundary='
      }

      const fn = jest.fn()
      const busboyInstance = uplodaHandler.registerEvents(headers, fn)

      const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])
      busboyInstance.emit('file', 'filedname', fileStream, 'filename')

      busboyInstance.listeners("finish")[0].call()
      expect(uplodaHandler.onFile).toHaveBeenCalled()

      expect(fn).toHaveBeenCalled()
    })

  });

  describe('#onFile', () => { 
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hey', 'dude']
      const downloadsFolder = '/tmp'
      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder
      })
      
      const onData = jest.fn()
      jest.spyOn(fs, fs.createWriteStream.name)
      .mockImplementation(() => TestUtil.generateWritableStream(onData))
      
      const onTransform = jest.fn()
      jest.spyOn(handler, handler.handleFileBytes.name)
        .mockImplementation(() => TestUtil.generateTransformStream(onTransform))

      const params = {
        fieldname: 'video',
        file: TestUtil.generateReadableStream(chunks),
        filename: 'mockFile.mov'
      }
      await handler.onFile(...Object.values(params))

      expect(onData.mock.calls.join()).toEqual(chunks.join())
      expect(onTransform.mock.calls.join()).toEqual(chunks.join())

      const expectedFilename = resolve(handler.downloadsFolder, params.filename)
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilename)
    })
  });

  describe('#handleFileBytes', () => {
    test.todo('should')
  });
});