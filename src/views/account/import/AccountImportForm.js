import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import React, { useState } from 'react';
import flash from '../../../utils/Flash';
import { Button, Collapse, List, Switch, Upload } from 'antd';
import api from '../../../utils/Axios';
import error_popup from '../../../utils/popup/ErrorPopup';
import { data } from 'react-router-dom';

const columns = [
    {
        title: 'Tên khách hàng *',
        description: 'Viết họ và tên của khách hàng. VD: Trần Văn A',
    },
    {
        title: 'Số điện thoại',
        description: 'Số điện thoại của khách hàng. VD: 0987654321',
    },
    {
        title: 'Mã khách hàng *',
        description: 'Mã của khách hàng để đánh dấu. VD: KH001',
    },
    {
        title: 'Giới tính',
        description:
            'Chọn giới tính của khách hàng. VD: Nam = 1, Nữ = 2, Khác = 0',
    },
    {
        title: 'Email *',
        description: 'Địa chỉ email của khách hàng. VD: trvana@gmail.com',
    },
    {
        title: 'Người phụ trách',
        description:
            'Chọn người phụ trách của khách hàng theo username hoặc tên. VD: admin, david, ...',
    },
    {
        title: 'Ngày sinh',
        description: 'Ngày sinh của khách hàng. VD: 2000-01-01',
    },
    {
        title: 'Ngành nghề',
        description:
            'Chọn ngành nghề của khách hàng. VD: Kinh doanh, Kế toán, Tài chính,...',
    },
    {
        title: 'Nguồn khách hàng *',
        description:
            'Chọn nguồn khách hàng của khách hàng theo mã hoặc tên. VD: facebook, zalo, ...',
    },
    {
        title: 'Người giới thiệu *',
        description:
            'Chọn người giới thiệu của khách hàng theo username hoặc tên. VD: admin, david,...',
    },
    {
        title: 'Mối quan hệ',
        description:
            'Chọn mối quan hệ của khách hàng. VD: Khách hàng tiềm năng,...',
    },
];

const AccountImportForm = (props) => {
    const [file, setFile] = useState(null);
    const [ignore_error, setIgnore] = useState(false);
    const [override, setOverride] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Xử lý khi chọn file
    const handleChange = (info) => {
        const newFile = info.fileList[0]?.originFileObj || null; // Lấy đúng File object
        setFile(newFile);
    };
    

    const handleSubmit = () => {
        if (!file) {
            flash.error('Chưa có file, hãy kiểm tra lại');
            return; // Dừng hàm nếu không có file
        }

        props.callback(true); // Báo hiệu bắt đầu xử lý

        (async () => {
            try {
                const formData = new FormData();
                formData.append('file', file); // Gửi file đúng cách

                // Nếu API hỗ trợ gửi thêm options, có thể append vào formData
                formData.append('options', JSON.stringify({
                    ignore_error: ignore_error,
                    allow_override: override
                }));

                const response = await api.post(
                    `/api/account/import/upload.file`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Đảm bảo gửi đúng kiểu dữ liệu
                        },
                    }
                );

                console.log(response);
                if (!response?.data.length) {
                    error_popup.show('Tải lên thất bại. Không có hàng nào được tải lên');
                    return ;
                }
                
                flash.success('Tải lên thành công');
                props.onUpload(
                    {
                        file: file,
                        ignore_error: ignore_error,
                        allow_override: override,
                        list: response.data
                    }
                );
            } catch (err) {
                console.log(err);
                error_popup.show(err?.response?.data?.message || err.message || 'Tải lên thất bại');
            } finally {
                props.callback(false); // Báo hiệu kết thúc xử lý
            }
        })();
    };

    const beforeUpload = (file) => {
        const isExcel =
            file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
    
        if (!isExcel) {
            flash.error('Chỉ chấp nhận file .xls hoặc .xlsx!');
            return Upload.LIST_IGNORE;
        }
    
        setFile(file); // Lưu đúng File object
        return false; // Không tự động upload
    };
    

    const handleDownloadTemplate = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get(`/api/account/import/template`, {
                responseType: 'blob', // Quan trọng: Để nhận phản hồi dưới dạng file
            });
            // Lấy tên file từ header nếu có
            const disposition = response.headers['content-disposition'];
            let fileName = 'template.xlsx'; // Đặt mặc định
            if (disposition) {
                const match = disposition.match(/filename="?(.+?)"?$/);
                if (match) fileName = match[1];
            }

            // console.log(response);

            // Tạo URL để tải xuống file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            flash.success('Tải xuống thành công');
        } catch (err) {
            console.log(err);
            flash.error('Tải xuống thất bại');
        }
    };
    return (
        <div className="flex items-center justify-center pt-3">
            <div className="max-w-[1000px] w-full">
                <div className="font-medium text-xl pb-3">
                    Chọn một tập tin từ máy
                </div>
                <Dragger
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    fileList={file ? [file] : []}
                    maxCount={1}
                    multiple={false}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click hoặc kéo file vào đây
                    </p>
                    <p className="ant-upload-hint">
                        Chỉ chấp nhận file excel có đuôi .xls, .xlsx
                    </p>
                </Dragger>
                <div className="font-medium text-xl pt-4 pb-3">Lựa chọn</div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-2">
                        <Switch
                            checked={ignore_error}
                            onChange={(value) => setIgnore(value)}
                        />
                        <div>Bỏ qua lỗi</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Switch
                            checked={override}
                            onChange={(v) => setOverride(v)}
                        />
                        <div>Cho phép ghi đè</div>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between pb-3 pt-4">
                    <div className="font-medium text-xl">Mẫu của file</div>
                    <a
                        className="text-sm text-blue-500 hover:text-blue-700 active:text-blue-900 underline cursor-pointer"
                        href="#"
                        onClick={handleDownloadTemplate}
                    >
                        Tải xuống mẫu
                    </a>
                </div>
                <Collapse
                    items={[
                        {
                            key: '1',
                            label: 'Danh sách các cột',
                            children: (
                                <List
                                    dataSource={columns}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <div
                                                        style={{
                                                            fontWeight: 'bold',
                                                            width: '30px',
                                                        }}
                                                        className="pl-[10px]"
                                                    >
                                                        {index +
                                                            1 +
                                                            (currentPage - 1) *
                                                                4}
                                                        .
                                                    </div>
                                                }
                                                title={item.title}
                                                description={item.description}
                                            ></List.Item.Meta>
                                        </List.Item>
                                    )}
                                    pagination={{
                                        pageSize: 4,
                                        onChange: (page) =>
                                            setCurrentPage(page),
                                    }}
                                ></List>
                            ),
                        },
                    ]}
                    defaultActiveKey={['1']}
                />

                <div className="pt-4 flex items-center w-full justify-end">
                    <Button type="primary" onClick={handleSubmit}>
                        Gửi file
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccountImportForm;
