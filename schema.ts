export type ApiResponse<Data> =
  | { status: 'success'; data: Record<string, Data> }
  | {
      status: 'fail';
      error: {
        code: number;
        message: string;
        details?: Record<string, string>;
      };
    };
