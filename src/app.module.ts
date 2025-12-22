import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule,ConfigModule.forRoot({
      isGlobal: true,
    }), ProductModule,
    
  ],
  controllers: [AppController],
 providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      
    },

    // {
    //   provide: APP_GUARD, 
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
