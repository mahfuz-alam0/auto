interface DeviceProps {
  ipAddress: string | null;
  deviceName: string;
  port: string | null;
  meta: string | null;
}

interface IDevice {
  createdAt: string;
  deletedAt: string | null;
  deviceProps: DeviceProps;
  jobType: string;
  name: string;
  orgId: string;
  sessionId: string;
  shopId: string;
  updatedAt: string |null;
  updatedBy: string | null;
  __v: number;
  _id: string;
}