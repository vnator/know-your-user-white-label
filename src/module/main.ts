import http from 'src/adapter/incoming/http';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await http.bind(AppModule);
}
bootstrap();
