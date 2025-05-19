import React, { useState } from "react";
import { Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Goback from "../../utils/goBack";
import Dropdown from "../../components/dropDown/DropDown";
import { Link } from "react-router-dom";
import { useCommon } from "../../contexts/CommonContext";
import { useFilter } from "../../Hooks/useFilter";
import TestReceipt from "../../components/testPrint/TestReceipt";


const Home: React.FC = () => {
    const { shops, choseWhatToDo, fetchPrinters, devices, printers, testSelected, setTestSelected } = useCommon();
    const { filterData, setFilterData, isLoading, error } = useFilter(shops[0]);

    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedPrinter, setSelectedPrinter] = useState<any>(printers.find((printer: any) => printer.isDefault) || { name: "No Printer Detected" });

    const getSelectedJobType = () => {
        const selectedDeviceObj = devices?.find(({ _id }: any) => _id === selectedDevice);
        if (!selectedDeviceObj) return { jobType: null, deviceName: null };

        const selectedJobType = choseWhatToDo?.find(
            ({ value }: any) => value === selectedDeviceObj.jobType
        ) || null;

        return {
            jobType: selectedJobType,
            deviceName: selectedDeviceObj.name,
        };
    };

    const handleChange = {
        search: (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilterData((prev: any) => ({
                ...prev,
                search: { str: e.target.value },
            }));
        },

        jobType: (option: any) => {
            setFilterData((prev: any) => ({
                ...prev,
                client: option,
            }));
        },

        shop: (option: any) => {
            setFilterData((prev: any) => ({
                ...prev,
                shop: option,
            }));
        },
    };

    const handleClearFilters = () => {
        const defaultShop = shops.length > 0 ? shops[0] : null;
        setFilterData({ search: { str: "" }, client: null, shop: defaultShop });
    };

    return (
        <>
            <div className="existing-client-container">
                <Goback title={"Existing Client"} />
                <Row gutter={[16, 16]} align="middle" className="controls">
                    {/* Search Input */}
                    <Col xs={24} sm={12} md={8} className="input-col">
                        <div className="input-wrapper">
                            <SearchOutlined className="input-icon" />
                            <input
                                disabled={isLoading}
                                type="text"
                                value={filterData.search.str}
                                onChange={handleChange.search}
                                placeholder="Search for clients"
                                className="input"
                            />
                        </div>
                    </Col>

                    {/* Client Type Dropdown */}
                    <Col xs={24} sm={12} md={8}>
                        <Dropdown
                            selectedValue={filterData.client?.label || ""}
                            setSelectedValue={handleChange.jobType}
                            placeholder="Choose what to do"
                            disabled={isLoading}
                        >
                            {choseWhatToDo.map((option: any, index: any) => (
                                <Dropdown.Option key={index} option={option}>
                                    {option.label}
                                </Dropdown.Option>
                            ))}
                        </Dropdown>
                    </Col>

                    {/* Shop Dropdown */}
                    <Col xs={24} sm={12} md={8}>
                        <Dropdown
                            selectedValue={filterData.shop?.name || ""}
                            setSelectedValue={handleChange.shop}
                            placeholder="Select Shop"
                            disabled={isLoading}
                        >
                            {shops.map((shop: any, index: any) => (
                                <Dropdown.Option key={index} option={shop}>
                                    {shop.name}
                                </Dropdown.Option>
                            ))}
                        </Dropdown>
                    </Col>

                    <Col xs={24}>
                        <div className="diviceStatus">
                            <div className="buttons">
                                <button className="btn primary white" onClick={handleClearFilters}>
                                    Reset Filter
                                </button>
                                <TestReceipt />
                            </div>
                            <div className="deviceCon">
                                <Dropdown
                                    selectedValue={testSelected.name}
                                    setSelectedValue={setTestSelected}
                                    placeholder="No Printer Detected"
                                >
                                    {printers.map((printer: any, index: any) => (
                                        <Dropdown.Option key={index} option={printer}>
                                            {printer.name}
                                        </Dropdown.Option>
                                    ))}
                                </Dropdown>
                                <div className="buttons">
                                    <button
                                        className="btn primary orange"
                                        onClick={fetchPrinters}
                                    >
                                        Re-Scan
                                    </button>

                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {devices.length > 0 ? <ul className="device-list">
                    {devices?.map((device: any) => (
                        <li
                            key={device._id}
                            className="device-item"
                            onClick={() => setSelectedDevice(device._id)}
                        >
                            <span>{device.name}</span>
                            <input
                                type="checkbox"
                                checked={selectedDevice === device._id}
                                readOnly
                            />
                        </li>
                    ))}
                </ul>
                    :
                    <div className="no-printer-available">
                        <div className="no-printer-message">
                            <p>No device are available at the moment</p>
                            <p>You can add new device setup</p>
                        </div>
                    </div>
                }



                {/* Action Buttons */}
                <div className="action-buttons">
                    <Link
                        to="/configure-client"
                        className="btn primary white large"
                        state={{
                            isReset: true,
                            clientValue: getSelectedJobType().jobType,
                            textValue: getSelectedJobType().deviceName,
                            shopValue: filterData.shop,
                            deviceValue: selectedDevice,
                            deviceId: selectedDevice,
                        }}
                    >
                        Reset Client
                    </Link>
                    <Link to="/configure-client" className="btn primary orange large">
                        Setup this device as a new client
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;