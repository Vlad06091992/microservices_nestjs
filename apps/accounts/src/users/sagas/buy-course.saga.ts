import { UserEntity } from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@org/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseStepStarted } from './buy-course.steps';


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
        this.state = new BuyCourseStepStarted()
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased:
        break;
      case PurchaseState.Canceled:
        break;
    }

    this.state.setContext(this);
    this.user.updateCourseStaus(courseId, state);
  }
}
