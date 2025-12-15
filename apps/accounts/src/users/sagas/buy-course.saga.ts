import { UserEntity } from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@org/interfaces';
import { BuyCourseState } from './buy-course.state';

export class BuyCourseSaga {
  private state: BuyCourseState;

  constructor(
    private readonly user: UserEntity,
    private readonly courseId: string,
    private readonly rmqService: RMQService
  ) {}

  public getState() {
    return this.state;
  }

  setState(state: PurchaseState) {
    switch (state) {
      case PurchaseState.Started:
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased:
        break;
      case PurchaseState.Canceled:
        break;
    }

    this.state.setContext(this);
    this.user.updateCourseStaus(this.courseId, state);
  }
}
