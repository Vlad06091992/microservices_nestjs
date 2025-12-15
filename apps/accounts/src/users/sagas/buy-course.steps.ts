import { BuyCourseSagaState } from './buy-course.state';
import { UserEntity } from '../entities/user.entity';
import { CoursesGetCourse, PaymentGenerateLink } from '@org/contracts';
import { PurchaseState } from '@org/interfaces';

//реализация конкретного шага исходя из общего шаблона состояний
export class BuyCourseStepStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CoursesGetCourse.Request,
      CoursesGetCourse.Response
    >(CoursesGetCourse.topic, { id: this.saga.courseId });

    if (!course) {
      throw new Error('Course not found');
    }

    const courseId = course._id.toString();

    if (course.price === 0) {
      this.saga.setState(PurchaseState.Canceled, courseId);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId,
      userId: this.saga.user._id.toString(),
      sum: course.price,
    });

    this.saga.setState(PurchaseState.WaitingForPayment, course._id.toString());
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж который не начался');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return {user:this.saga.user};
  }
}
