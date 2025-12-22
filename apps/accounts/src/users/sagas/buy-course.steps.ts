import { BuyCourseSagaState } from './buy-course.state';
import { UserEntity } from '../entities/user.entity';
import {
  CoursesGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
} from '@org/contracts';
import { PurchaseState } from '@org/interfaces';
//1
//реализация конкретного шага исходя из общего шаблона состояний
export class BuyCourseSagaStateStarted extends BuyCourseSagaState {

  //генерим ссылку на оплату, переводим в состояние оплаты
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
    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж который не начался');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user };
  }
}

//2
export class BuyCourseSagaStateWaitungForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Нельзя оплатить уже оплаченный курс.');
  }

  //если курс оплачен, переводим в финиш
  //если оплата в процессе???
  //если оплата в отменена???
  public async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      courseId: this.saga.courseId,
      userId: this.saga.user._id.toString(),
    });


    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
      return { user: this.saga.user };
    }

    if (status !== 'success') {
      return { user: this.saga.user };
    }

    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user };




    // if (status === 'success') {
    //   this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    // }
    //
    // if (status === 'inProgress') {
    //   this.saga.setState(PurchaseState.WaitingForPayment, this.saga.courseId);
    // }
    //
    // if (status === 'canceled') {
    //   this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    // }
    //
    // return { user: this.saga.user };
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить платеж в процессе.');
  }
}

//3
export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Нельзя оплатить уже оплаченный курс.');
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Method not implemented.');
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить уже оплаченный курс.');
  }
}

//0
export class BuyCourseSagaStateCancel extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
   return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж по купленному курсу.');
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить купленный курс.');
  }
}
