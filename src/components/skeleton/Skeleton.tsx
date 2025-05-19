import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Row, Col } from 'antd';


const GobackSkeleton: React.FC = () => (
    <div className="goback">
        <FaArrowLeft className="back-icon" />
        <Skeleton width={150} />
    </div>
);

const ReactSkeleton: React.FC = () => (
    <div className="existing-client-container">
        <GobackSkeleton />
        <Row
            gutter={[16, 16]}
            align={"middle" as string | undefined}
            className="controls"
        >
            <Col xs={24} sm={12} md={8}>
                <Skeleton width="100%" height={40} />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Skeleton width="100%" height={40} />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Skeleton width="100%" height={40} />
            </Col>
        </Row>

        <ul className="device-list">
            <li className="device-item">
                <Skeleton width={150} />
                <Skeleton width={30} height={20} />
            </li>
            <li className="device-item">
                <Skeleton width={150} />
                <Skeleton width={30} height={20} />
            </li>
        </ul>

        <div className="action-buttons">
            <Skeleton width={200} height={50} />
            <Skeleton width={250} height={50} />
        </div>
    </div>
);

export default ReactSkeleton;