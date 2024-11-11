import { Avatar, Dropdown, MenuProps } from 'antd';
import { ProductOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../app/supabaseClient';
import { useSelector } from 'react-redux';
import { getUser } from '../../app/ui.slice/ui.slice.selectors';


interface UserAvatarProps {
    smallVersion: boolean;
}
const UserAvatar = ({ smallVersion = false }: UserAvatarProps) => {
    const navigate = useNavigate();
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }

    const user = useSelector(getUser)
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Change Project',
            icon: <ProductOutlined />,
        },
        {
            key: '2',
            label: 'Logout',
            icon: <LogoutOutlined />,
        },
    ];

    const clickContextMenu = (e: {key: string}) => {
        switch (e.key) {
            case '1':
                navigate('/');
                break;
            case '2':
                logOut();
                break;
        }
    };

    return (
        <div className="bottomIcons">
            <Dropdown menu={{ items, onClick: clickContextMenu }}>
                <div className="avatar">
                    <Avatar style={{ backgroundColor: '#87d068', color: '#ffffff' }}>{user?.email?.toUpperCase().charAt(0)}</Avatar>
                    {!smallVersion && <span>{user?.email}</span>}
                </div>
            </Dropdown>
        </div>
    );
};

export default UserAvatar;
