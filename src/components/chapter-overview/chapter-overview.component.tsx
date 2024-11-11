import './chapter-overview.scss';
import { Tooltip } from 'antd';
import Anchor from 'antd/es/anchor/Anchor';

import { useSelector } from 'react-redux';
import { getItemsV2 } from '../../app/items.slice/item.slice.selectors';

//@ts-ignore: The Link property exists, is just not seen by tslint. Idk why 
const { Link } = Anchor;

const ChapterOverview = () => {

    const items = useSelector(getItemsV2)
    const chapters = items.filter((i) => i.type == "H1")


    const chapterItems = chapters.map((chapter, index) => ({
        key: index,
        href: `/project/${chapter.project_id}#${chapter.item_id}`,
        title: <Tooltip mouseEnterDelay={1} title={chapter.outline}><div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: "15em"
        }}>
            {chapter.outline}</div>
        </Tooltip>
    }))


    return (
        <nav className="ChapterOverview">
            <h2>Chapters</h2>
            <div className="chapters-list">
                <Anchor
                    items={chapterItems}
                    onClick={(e) => e.preventDefault()}
                />
            </div>

        </nav >
    );
};

export default ChapterOverview;