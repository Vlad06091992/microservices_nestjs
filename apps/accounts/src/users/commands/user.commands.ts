import { Controller } from '@nestjs/common';

@Controller()
export class UsersCommands {
  // constructor(@Inject() private readonly authService: AuthService) {}
  //
  // @RMQValidate()
  // @RMQRoute(AccountRegister.topic)
  // register(
  //   @Body() dto: AccountRegister.Request
  // ): Promise<AccountRegister.Response> {
  //   return this.authService.register(dto);
  // }
  //
  // @RMQValidate()
  // @RMQRoute(AccountLogin.topic)
  // async login(
  //   @Body() dto: AccountLogin.Request
  // ): Promise<AccountLogin.Response> {
  //   const { email, password } = dto;
  //   console.log(email, password);
  //   const { id } = await this.authService.validateUser(email, password);
  //   return await this.authService.login(id);
  // }
}


