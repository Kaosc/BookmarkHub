import { useSelector, useDispatch } from "react-redux"
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core"
import BookmarkGroupList from "../components/BookmarkGroupList"
import { useState } from "react"
import { editGroup } from "../redux/features/bookmarkSlice"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

export default function Home() {
	const bookmarkGroups = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()
	const [activeId, setActiveId] = useState()

	function handleDragStart(event: any) {
		const { active } = event
		const { id } = active

		setActiveId(id)
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<main>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragEnd={(event: DragEndEvent) => {
					const { active, over } = event

					// active output
					// {
					// 	id: 'default-2',
					// 	data: {
					// 	  current: {
					// 		 sortable: {
					// 			containerId: 'default-group',
					// 			index: 1,
					// 			items: [ 'default-1', 'default-2', 'default-3' ]
					// 		 }
					// 	  }
					// 	},
					// 	rect: {
					// 	  current: {
					// 		 initial: {
					// 			top: 185,
					// 			left: 193,
					// 			width: 64,
					// 			height: 0,
					// 			bottom: 185,
					// 			right: 257
					// 		 },
					// 		 translated: {
					// 			top: 66,
					// 			left: 139,
					// 			width: 64,
					// 			height: 0,
					// 			bottom: 66,
					// 			right: 203
					// 		 }
					// 	  }
					// 	}
					//  }

					// over output
					// {
					// 	id: 'pinned-1',
					// 	rect: Rect {
					// 	  width: 64,
					// 	  height: 65,
					// 	  top: 72,
					// 	  bottom: 137,
					// 	  right: 177,
					// 	  left: 113,
					// 	  rect: {
					// 		 top: 72,
					// 		 left: 113,
					// 		 width: 64,
					// 		 height: 65,
					// 		 bottom: 137,
					// 		 right: 177
					// 	  }
					// 	},
					// 	data: {
					// 	  current: {
					// 		 sortable: {
					// 			containerId: 'pinned-group',
					// 			index: 0,
					// 			items: [ 'pinned-1', 'pinned-2', 'pinned-3' ]
					// 		 }
					// 	  }
					// 	},
					// 	disabled: false
					//  }
				}}
			>
				{bookmarkGroups.map((bookmarkData) => (
					<BookmarkGroupList
						key={bookmarkData.id}
						bookmarkData={bookmarkData}
					/>
				))}
				<DragOverlay>{activeId ? <div></div> : null}</DragOverlay>
			</DndContext>
		</main>
	)
}
