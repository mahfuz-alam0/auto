import { Row } from 'antd';
import React from 'react';

declare module 'antd' {
    interface RowProps {
        children?: React.ReactNode;
        Gutter?: number[]
    }
    interface ColProps {
        children?: React.ReactNode;
        xs?: number;
        sm?: number;
        md?: number;
    }
}