import { UserResponseDTO } from 'src/modules/auth/dto/auth.dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserResponseDTO['user'];
    }
}
}