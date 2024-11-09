import './chapter-overview.scss';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Anchor from 'antd/es/anchor/Anchor';

import { HashLink } from 'react-router-hash-link';
import { useSelector } from 'react-redux';
import { getItemsV2 } from '../../app/items.slice/item.slice.selectors';

const { Link } = Anchor;

const ChapterOverview = () => {

    const items = useSelector(getItemsV2)
    const chapters = items.filter((i) => i.type == "H1")

    return (
        <nav className="ChapterOverview">
            <h2>Chapters</h2>
            <div className="chapters-list">
                <Anchor
                    onClick={(e) => e.preventDefault()}
                >
                    {chapters.map((chapter, index) => (
                        <Link
                            onClick={(e) => e.preventDefault()}
                            key={index}
                            href={`#${chapter.item_id}`}
                            target="_null"
                            title={
                                <Tooltip mouseEnterDelay={1} title={chapter.outline} >
                                    <HashLink smooth to={`/project/${chapter.project_id}#${chapter.item_id}`}>
                                        <span style={{
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '15em',
                                            color: "#666"
                                        }}>
                                            {chapter.outline}
                                        </span>
                                    </HashLink>
                                </Tooltip>}
                        />

                    ))}

                </Anchor>
            </div>
            {/* <Button icon={<PlusOutlined />} type="text" onClick={}>
                Add Chapter
            </Button> */}
        </nav >
    );
};

export default ChapterOverview;