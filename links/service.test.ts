import { expect, beforeEach, test, describe } from 'bun:test';
import userService from '../users/service';
import service from './service';

describe('create test service', () => {
  const VALID_NEW_LINK_DATA = {
    title: 'LINK TITLE 1',
    link: 'https://google.com',
  };
  const INVALID_NEW_LINK_DATA = {
    title: "",
    link: ""
  }
  const VALID_USER = {
    username: `testing`,
    key: '123',
  };
  const VALID_USER_ID = 16;
  const INVALID_USER_ID = 0;

  describe('success', () => {
    test('it should return success response', async () => {
      const result = await service.createLink(
        VALID_NEW_LINK_DATA,
        VALID_USER_ID,
      );
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data.links.title).toBe(VALID_NEW_LINK_DATA.title);
        expect(result.data.links.link).toBe(VALID_NEW_LINK_DATA.link);
      }
    });
  });
  describe('fail', () => {
    test('it should fail cause invalid user id', async () => {
      const result = await service.createLink(
        VALID_NEW_LINK_DATA,
        INVALID_USER_ID,
      );
      expect(result.status === 'fail');
      if (result.status === 'fail') {
        expect(result.error.code === 400);
        expect(
          result.error.message ===
            'fail to add new link, make sure you are using correct user account and try again',
        );
      }
    });
    test('it should fail cause invalid field', async() => {
      const result = await service.createLink(INVALID_NEW_LINK_DATA, VALID_USER_ID)
      expect(result.status).toBe("fail")
      if (result.status === "fail") {
        expect(result.error.code).toBe(400)
        expect(result.error.message).toBe('fail to add new link, please try again later')
      }
    })
  });
});
