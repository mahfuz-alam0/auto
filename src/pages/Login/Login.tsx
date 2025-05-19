import React, { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined
} from "@ant-design/icons";
import Logo from "../../static/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckOrganization, loginToHardwareClient } from "../../services/loginService";
import { FaAngleLeft, FaAngleRight, FaBuildingUser } from "react-icons/fa6";
import Loader from "../../components/microComponents/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../utils/shotToast";

const Login = () => {
  const [form] = Form.useForm();
  const [autoStart, setAutoStart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [organizationVerified, setOrganizationVerified] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      if (!organizationVerified) {
        if (!organizationName.trim()) {
          showToast.error("Please enter an organization username!");
          return;
        }

        const response = await CheckOrganization(organizationName);
        if (!response.data.data) {
          showToast.error("Organization not found!");
          return;
        }

        setOrganizationVerified(true);
        return;
      }

      const { email, password } = values;
      const response = await loginToHardwareClient({
        orgUsername: organizationName,
        email,
        password,
      });

      login(response.data.data);

      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      showToast.error(error?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setOrganizationVerified(false);
    // setOrganizationName("");
    // form.setFieldsValue({ organization: "" }); 
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="logoContainer">
          <img src={Logo} alt="Logo" />
        </div>

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={handleLogin}
          className="loginForm"
        >

          {!organizationVerified && (
            <>
              <Form.Item
                name="organization"
                rules={[{ required: true, message: "Please enter your organization username!" }]}
              >
                <Input
                  prefix={<FaBuildingUser />}
                  placeholder="Organization Username"
                  className="customInput"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </Form.Item>
            </>
          )}

          {organizationVerified && (
            <>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Your email"
                  className="customInput"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="customInput"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <div className="actionButtons">
              {organizationVerified && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="backButton btn primary outline loginButton"
                >
                  <FaAngleLeft /> Back
                </button>
              )}
              <button
                disabled={loading}
                type="submit"
                className="btn primary orange loginButton"
              >
                {loading && <Loader />}
                {organizationVerified ? "Login" : "Next"}
                <FaAngleRight width={"20px"} />
              </button>

            </div>
          </Form.Item>
          <Form.Item name="autoStart" valuePropName="checked">
            <Checkbox
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="autoStartCheckbox"
            >
              Allow to be started automatically
            </Checkbox>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
