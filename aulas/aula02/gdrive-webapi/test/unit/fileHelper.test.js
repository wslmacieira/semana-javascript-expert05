import { describe, test, expect, jest } from "@jest/globals";
import fs from 'fs'
import FileHelper from "../../src/fileHelper";

describe('#FileHelper test suite', () => {
  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {

      const statMock = {
        dev: 2080,
        mode: 33188,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 78264,
        size: 423556,
        blocks: 832,
        atimeMs: 1631235070457.7014,
        mtimeMs: 1631235070257.7014,
        ctimeMs: 1631235070257.7014,
        birthtimeMs: 1631235070177.7014,
        atime: '2021-09-10T00:51:10.458Z',
        mtime: '2021-09-10T00:51:10.258Z',
        ctime: '2021-09-10T00:51:10.258Z',
        birthtime: '2021-09-10T00:51:10.178Z'
      }

      const mockUser = 'wslmacieira'
      process.env.USER = mockUser
      const filename = 'file.png'
      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename])

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock)

      const result = await FileHelper.getFilesStatus("/tmp")

      const expectedResult = [
        {
          size: "424 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ]

      expect(fs.promises.stat).toHaveBeenLastCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})