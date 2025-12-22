import { UserEntity } from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@org/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import {
  BuyCourseSagaStateCancel,
  BuyCourseSagaStatePurchased,
  BuyCourseSagaStateWaitungForPayment,
  BuyCourseSagaStateStarted,
} from './buy-course.steps';

//Сага для выполнения операций при межсервисном взаимодействии
// В ней есть состояние, исходя из которого происходят операции
export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService
  ) {}

  public getState() {
    return this.state;
  }

  setState(state: PurchaseState, courseId: string) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted()
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuyCourseSagaStateWaitungForPayment()
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseSagaStatePurchased()
        break;
      case PurchaseState.Canceled:
        this.state = new BuyCourseSagaStateCancel()
        break;
    }

    this.state.setContext(this);
    this.user.setCourseStaus(courseId, state);
  }
}
