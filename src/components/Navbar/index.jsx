import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { logout } from '../../store/auth/authSlice';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompanyLogo = styled.div`
  width: 20px;
  height: 20px;
  background-color: #1890ff;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
  }
`;

const CompanyName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArrowIcon = styled.span`
  transition: transform 0.2s ease-in-out;
  transform: rotate(${(props) => (props.$isOpen ? '180deg' : '0deg')});
`;

const DropdownMenu = styled(Dropdown)``;

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData.userData);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  return (
    <NavbarContainer>
      <CompanyInfo>
        <CompanyLogo data-testid="company-logo"></CompanyLogo>
        <CompanyName>Nome da empresa</CompanyName>
      </CompanyInfo>
      <UserSection>
        <DropdownMenu
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
          onOpenChange={setDropdownOpen}
        >
          <UserName>
            {userData?.user?.email || 'Usuário'}
            <ArrowIcon $isOpen={dropdownOpen} data-testid="dropdown-arrow">
              <DownOutlined />
            </ArrowIcon>
          </UserName>
        </DropdownMenu>
      </UserSection>
    </NavbarContainer>
  );
};
