jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn(),
      }),
    },
  },
}));

const FileUploadService = require('@/lib/fileUploadService');

describe('FileUploadService.fileFilter', () => {
  it('accepts banner images with allowed mimetypes', (done) => {
    const svc = new FileUploadService();
    const file = { fieldname: 'bannerImage', mimetype: 'image/png' };
    svc.fileFilter({}, file, (err, ok) => {
      expect(err).toBeNull();
      expect(ok).toBe(true);
      done();
    });
  });

  it('rejects banner images with disallowed mimetypes', (done) => {
    const svc = new FileUploadService();
    const file = { fieldname: 'bannerImage', mimetype: 'text/plain' };
    svc.fileFilter({}, file, (err, ok) => {
      expect(err).toBeInstanceOf(Error);
      expect(ok).toBe(false);
      done();
    });
  });

  it('rejects unknown field names', (done) => {
    const svc = new FileUploadService();
    const file = { fieldname: 'unknown', mimetype: 'image/png' };
    svc.fileFilter({}, file, (err, ok) => {
      expect(err).toBeInstanceOf(Error);
      expect(ok).toBe(false);
      done();
    });
  });
});
