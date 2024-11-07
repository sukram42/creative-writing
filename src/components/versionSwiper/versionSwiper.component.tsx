import { CloseOutlined, HistoryOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState, version } from "react";

import "./versionSwiper.component.scss"
import { ItemV2, ItemVersion } from "../../app/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { getItemVersions } from "../../app/items.slice/item.slice.selectors";
import { AppDispatch } from "../../app/store";
import { fetchItemVersions, updateItemTextV2Async } from "../../app/items.slice/item.slice.async";
import { updateItemTextV2 } from "../../app/items.slice/item.slice";


interface VersionSwiperProps {
    item: ItemV2
}


export function VersionSwiper(props: VersionSwiperProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [showSwiper, setShowSwiper] = useState<boolean>(false)
    const [originalText, setOriginalText] = useState<string | null>(props.item.final)

    const versions = useSelector(getItemVersions)
    const itemVersions = props.item.item_id in versions ? versions[props.item.item_id] : null
    const itemVersionMapping = itemVersions?.reduce((prev, curr: ItemVersion) =>
        ({ ...prev, [curr.final_version]: curr }), {})
    const maxVersion = itemVersions ? itemVersions.length + 1 : null


    const [currentVersion, setCurrentVersion] = useState<number | null>(maxVersion)

    const toggleSwiper = () => {
        setShowSwiper(!showSwiper)
        resetVersion()
    }

    const resetVersion = () => {
        dispatch(updateItemTextV2({ field: "final", item: props.item, newText: originalText }))
        setOriginalText(props.item.final)
        setCurrentVersion(maxVersion)
    }

    const changeCurrentVersion = (newVersion: number) => {
        console.log("CHANGE CURRENT VERSION")
        if (!itemVersionMapping) return
        setCurrentVersion(newVersion)

        if (maxVersion == newVersion) {
            dispatch(updateItemTextV2({ field: "final", item: props.item, newText: originalText }))
            return
        }
        dispatch(updateItemTextV2({ field: "final", item: props.item, newText: itemVersionMapping![newVersion - 1].final }))
    }

    const setOldVersionAsNewVersion = () => {
        if (!currentVersion || !itemVersionMapping|| !maxVersion) return
        setShowSwiper(false)
        setCurrentVersion(maxVersion+1)
        setOriginalText(props.item.final)
        dispatch(updateItemTextV2Async({ field: "final", item: props.item, newText: itemVersionMapping![currentVersion - 1].final }))
    }
    const handleBlur = (e) => {
        const currentTarget = e.currentTarget;

        // Give browser time to focus the next element
        requestAnimationFrame(() => {
            // Check if the new focused element is a child of the original container
            if (e.relatedTarget !== null && !currentTarget.contains(e.relatedTarget)) {
                // Do blur logic here!
                resetVersion();
                setShowSwiper(false)
            }
        });
    };
    const handleKeyDown = (e) => {
        switch (e.key) {
            case "ArrowLeft":
                previousVersion()
                break;
            case "ArrowRight":
                nextVersion()
                break;
        }
    }

    const nextVersion = () => {
        if (!currentVersion || !maxVersion) return
        changeCurrentVersion(currentVersion < maxVersion ? currentVersion + 1 : maxVersion)
    }

    const previousVersion = () => {
        if (!currentVersion) return
        changeCurrentVersion(currentVersion > 1 ? currentVersion - 1 : 1)
    }

    useEffect(() => {
        dispatch(fetchItemVersions(props.item))
    }, [])

    useEffect(() => {
        // resetVersion()
        console.log("newVersion")
    }, [versions])

    if (!maxVersion || maxVersion == 1) return <></>
    return (
        <div className="versionSwiper" onBlur={handleBlur} onKeyDown={handleKeyDown} >
            <Button type="text"
                shape="circle"
                onClick={() => toggleSwiper()}
                icon={!showSwiper ? <HistoryOutlined /> : <CloseOutlined />}>
            </Button>
            {showSwiper && currentVersion && maxVersion &&
                <>
                    <Button type="text"
                        shape="circle"
                        onClick={() => previousVersion()}
                        icon={<LeftOutlined />}>
                    </Button>
                    version {currentVersion} of {itemVersions ? itemVersions.length + 1 : "1"}
                    <Button type="text"
                        shape="circle"
                        icon={<RightOutlined />}
                        onClick={() => nextVersion()}>
                    </Button>
                </>
            }
            {showSwiper && currentVersion !== maxVersion ?
                <Button onClick={() => setOldVersionAsNewVersion()}>
                    use this version
                </Button> : ""}
        </div >
    )
}