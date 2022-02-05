import { IMicroFrontEndInfo, IMicroFrontEndProps } from './MicroFrontEnd.models';

export const MICRO_FRONTEND_ACTIONS = {
  INITIALIZE: 'initialize'
};

export interface IMicroFrontEndActions {
  initialize: (props: IMicroFrontEndProps) => IMicroFrontEndInfo;
  updateData: (data: any) => void;
}
