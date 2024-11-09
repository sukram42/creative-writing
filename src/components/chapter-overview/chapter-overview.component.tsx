import { useEffect, useState } from 'react';
import './chapter-overview.scss';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Anchor from 'antd/es/anchor/Anchor';

import { HashLink } from 'react-router-hash-link';

const { Link } = Anchor;

const ChapterOverview = () => {
    const [chapters, setChapters] = useState([
        'Einsatzbereich von AI @[company...',
        'Probleme von AI Systemen',
        'AI Einsatz'
    ]);


    const addChapter = () => {
        setChapters([...chapters, 'New Chapter']);
    };

    return (
        <nav className="ChapterOverview">
            <h2>Chapters</h2>
            <div className="chapters-list">
                <Anchor
                // affix={false}
                // onClick={handleClick}
                // items={[
                //     {
                //         key: '1',
                //         href: '#b4ca6116-5741-4716-a614-6588254f4cda',
                //         title: 'Chapter 1',
                //     },
                //     {
                //         key: '2',
                //         href: '#3a12c776-7675-4d0f-aa57-014f1f180083',
                //         title: 'Chapter 2',
                //     }
                // ]}
                >
                    <Link
                        href="#b4ca6116-5741-4716-a614-6588254f4cda"
                        target="_null"
                        title={<HashLink smooth to="/project/7e6183ec-bc0d-4b0d-89cb-2290f1992a95#b4ca6116-5741-4716-a614-6588254f4cda">Section 1</HashLink>}
                    />
                    <Link
                        href="#3a12c776-7675-4d0f-aa57-014f1f180083"
                        target="_null"
                        title={<HashLink smooth to="/project/7e6183ec-bc0d-4b0d-89cb-2290f1992a95#3a12c776-7675-4d0f-aa57-014f1f180083">Section 2</HashLink>}
                    />
                </Anchor>

                {/* {chapters.map((chapter, index) => (
                    <div key={index} className="chapter-item">
                        {chapter}
                    </div>
                ))} */}
            </div>
            <Button icon={<PlusOutlined />} type="text" onClick={addChapter}>
                New
            </Button>
        </nav>
    );
};

export default ChapterOverview;