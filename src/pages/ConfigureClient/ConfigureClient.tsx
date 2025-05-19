import React, { useState, useEffect } from "react";
import Goback from "../../utils/goBack";
import { Col, Row } from "antd";
import Dropdown from "../../components/dropDown/DropDown";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPrintClient, CreatePrintClient } from "../../services/clientServices";
import axiosExternal from "../../utils/axios";
import Loader from "../../components/microComponents/Loader";
import { useCommon } from "../../contexts/CommonContext";
import TestReceipt from "../../components/testPrint/TestReceipt";

interface LocationState {
    isReset?: boolean;
    clientValue?: any;
    shopValue?: any;
    deviceValue?: any;
    textValue?: string;
    deviceId?: string;
}

const ConfigureClient: React.FC = () => {
    const { shops, choseWhatToDo, printers, fetchPrinters } = useCommon();
    const location = useLocation();
    const navigate = useNavigate();

    const state = (location.state || {}) as LocationState;

    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isReset, setIsReset] = useState<boolean>(state.isReset || false);
    const [clientValue, setClientValue] = useState<any>(state.clientValue || { label: "Choose what to do", value: "" });
    const [shopValue, setShopValue] = useState<any>(state.shopValue || { name: "Select Shop", id: "" });
    const [selectedPrinter, setSelectedPrinter] = useState<any>(state.deviceValue || printers.find((printer: any) => printer.isDefault) || { name: "Select Device" });
    const [textValue, setTextValue] = useState<string>(state.textValue || "");
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

    const [deviceProps, setDeviceProps] = useState<any>({
        ipAddress: null,
        port: window.location.port || "3000",
        meta: null,
    });

    useEffect(() => {
        try {
            setRefreshLoading(true);
            if (!isReset) {
                const defaultPrinter = printers.find((printer: any) => printer.isDefault);
                setSelectedPrinter(defaultPrinter || { name: "Select Device" });
            }
        } catch (error) {
            console.error("Error finding default printer:", error);
        } finally {
            setRefreshLoading(false);
        }
    }, [printers, isReset]);

    useEffect(() => {
        const getPublicIP = async () => {
            try {
                const response = await axiosExternal.get<{ ip: string }>("https://api.ipify.org?format=json");
                return response.data.ip;
            } catch (error) {
                console.error("Error fetching public IP:", error);
                return null;
            }
        };

        const getDeviceMeta = () => ({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
        });

        const fetchDeviceDetails = async () => {
            const ipAddress = await getPublicIP();
            const port = window.location.port || "3000";
            const meta = getDeviceMeta();
            setDeviceProps({ ipAddress, port, meta });
        };

        fetchDeviceDetails();
    }, []);

    const handleSave = async () => {
        const errors: string[] = [];

        if (clientValue.label === "Choose what to do") errors.push("Please select a Client Type.");
        if (shopValue.name === "Select Shop") errors.push("Please select a Shop.");
        if (selectedPrinter.name === "Select Device") errors.push("Please select a Device.");
        if (!textValue.trim()) errors.push("Please enter a Name in the text field.");

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        setLoading(true);
        try {
            let payload = {
                shopId: shopValue.id,
                name: textValue,
                jobType: clientValue.value,
                deviceProps: {
                    ipAddress: deviceProps.ipAddress,
                    deviceName: selectedPrinter.name,
                    port: deviceProps.port,
                    meta: deviceProps.meta,
                },
                id: state.deviceId
            };

            let response: any;
            if (isReset) {
                payload = { ...payload, id: state.deviceId };
                response = await ResetPrintClient(payload);
                alert("Print client reset successfully!");
            } else {
                response = await CreatePrintClient(payload);
                alert("Print client created successfully!");
            }
            navigate("/");
        } catch (error) {
            console.error("Failed to process print client:", error);
            alert(error || "Failed to process print client.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-configure-container">
            <Goback title="Configure Client" />
            <Row gutter={[16, 16]} align="middle" className="controls">
                <Col xs={24} sm={12}>
                    <Dropdown
                        selectedValue={clientValue.label}
                        setSelectedValue={setClientValue}
                        placeholder="Choose what to do"
                        disabled={isReset}
                    >
                        {choseWhatToDo.map((option: any, index: any) => (
                            <Dropdown.Option key={index} option={option}>
                                {option.label}
                            </Dropdown.Option>
                        ))}
                    </Dropdown>
                </Col>
                <Col xs={24} sm={12}>
                    <Dropdown
                        selectedValue={shopValue.name}
                        setSelectedValue={setShopValue}
                        placeholder="Select Shop"
                        disabled={isReset}
                    >
                        {shops.map((shop: any, index: any) => (
                            <Dropdown.Option key={index} option={shop}>
                                {shop.name}
                            </Dropdown.Option>
                        ))}
                    </Dropdown>
                </Col>
                <Col xs={24}>
                    <div className="textarea-wrapper">
                        <textarea
                            placeholder="e.g Agent for printing exit label"
                            className="textarea"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            disabled={loading || isReset}
                        />
                    </div>
                </Col>
                <Col xs={24}>
                    <Dropdown
                        selectedValue={selectedPrinter.name}
                        setSelectedValue={setSelectedPrinter}
                        placeholder="Select Device"
                    >
                        {printers.map((printer: any, index: any) => (
                            <Dropdown.Option key={index} option={printer}>
                                {printer.name}
                            </Dropdown.Option>
                        ))}
                    </Dropdown>
                </Col>
                <Col xs={24}>
                    <div className="conditionArea">

                        <label className="checkBoxToPrev">
                            <input
                                type="checkbox"
                                checked={isPreview}
                                onChange={() => setIsPreview(!isPreview)}
                            />
                            Show Preview For Test
                        </label>

                        <button
                            disabled={refreshLoading}
                            className="btn primary orange"
                            onClick={fetchPrinters}
                        >
                            {refreshLoading && <Loader />}
                            Re-Scan Devices
                        </button>
                    </div>
                </Col>
            </Row>
            <div className="action-buttons">
                <TestReceipt />
                <button
                    disabled={loading}
                    onClick={handleSave}
                    className="btn primary orange large"
                >
                    {loading && <Loader />} Save
                </button>
            </div>
        </div>

    );
};

export default ConfigureClient;
