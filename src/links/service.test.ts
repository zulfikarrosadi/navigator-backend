import service from './service';

describe('create test service', () => {
  const VALID_NEW_LINK_DATA = {
    title: 'LINK TITLE 1',
    link: 'https://google.com',
  };
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
  });
});

describe('update link service tests', () => {
  const VALID_NEW_LINK_DATA = {
    title: 'UPDATED LINK TITLE',
    link: 'https://google.com',
  };
  const VALID_USER = {
    username: `testing`,
    key: '123',
  };
  const VALID_USER_ID = 16;
  const INVALID_USER_ID = 0;
  const VALID_BUT_NOT_FOUND_LINK_ID = '0';
  const INVALID_LINK_ID = 'invalid';

  describe('fail', () => {
    test('should return fail response, invalid id and cause not found', async () => {
      const result = await service.updateLink(
        VALID_NEW_LINK_DATA,
        INVALID_LINK_ID,
        VALID_USER_ID,
      );
      expect(result.status).toBe('fail');
      if (result.status === 'fail') {
        expect(result.error.code).toBe(404);
        expect(result.error.message).toBe(
          'fail to update link, link id not found',
        );
      }
    });
    test('should return fail response, link id not found', async () => {
      const result = await service.updateLink(
        VALID_NEW_LINK_DATA, VALID_BUT_NOT_FOUND_LINK_ID,
        VALID_USER_ID,
      );
      expect(result.status).toBe("fail")
      if (result.status === "fail") {
        expect(result.error.code).toBe(404)
        expect(result.error.message).toBe('update link fail, link is not found')
      }
    });
    test('should return fail response, user try to update link that not belong to them', async () => {
      const newLink = await service.createLink(VALID_NEW_LINK_DATA, VALID_USER_ID)
      let linkId: string
      if (newLink.status === "success") {
        linkId = `${newLink.data.links.id}`
      } else {
        expect().fail('create dummy data fail')
      }
      const result = await service.updateLink(VALID_NEW_LINK_DATA, linkId!, INVALID_USER_ID)
      expect(result.status).toBe("fail")
      if(result.status === "fail") {
        expect(result.error.code).toBe(404);
        expect(result.error.message).toBe(
          'update link fail, link is not found',
        );
      }
    })
  });

  describe('success', () => {
    test('should return success response', async () => {
      const newLink = await service.createLink(VALID_NEW_LINK_DATA, VALID_USER_ID)
      let linkId: string
      if (newLink.status === "success") {
        linkId = `${newLink.data.links.id}`
      } else {
        expect().fail('update success fail, fail to create dummy data')
      }
      const result = await service.updateLink(VALID_NEW_LINK_DATA, linkId!, VALID_USER_ID)
      expect(result.status).toBe('success')
      if (result.status === 'success') {
        expect(result.data.links.title).toBe(VALID_NEW_LINK_DATA.title)
      }
    })
  })
});
