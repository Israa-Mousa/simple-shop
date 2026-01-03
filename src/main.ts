import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/loggin.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter, ImageKitExceptionFilter } from './exceptions/exception';
BigInt.prototype.toJSON = function () {
  return this.toString();
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor(),new ResponseInterceptor(),);
 
app.useGlobalFilters(new HttpExceptionFilter(),new ImageKitExceptionFilter);
await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
