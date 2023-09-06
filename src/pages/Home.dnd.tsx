import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { useSelector, useDispatch } from "react-redux"
import { editGroup } from "../redux/features/bookmarkSlice"

import Bookmark from "../components/Bookmark"
import BookmarkGroupList from "../components/BookmarkGroupList"

export default function Home() {
	const bookmarkGroups = useSelector((state: StoreRootState) => state.bookmarks)
	const dispatch = useDispatch()

	const move = (
		source: Bookmark[],
		destination: Bookmark[],
		droppableSource: { index: number; droppableId: string | number },
		droppableDestination: { index: number; droppableId: string | number },
	) => {
		const sourceClone = Array.from(source)
		const destClone = Array.from(destination)
		const [removed] = sourceClone.splice(droppableSource.index, 1)

		destClone.splice(droppableDestination.index, 0, removed)

		const result = {
			[droppableSource.droppableId]: sourceClone,
			[droppableDestination.droppableId]: destClone,
		}

		return result
	}

	const reorder = (list: Bookmark[], startIndex: number, endIndex: number) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	function onDragEnd(result: { source: any; destination: any }) {
		const { source, destination } = result

		// dropped outside the list
		if (!destination) {
			return
		}

		const sourceID = source.droppableId
		const destinationID = destination.droppableId

		if (sourceID === destinationID) {
			const bookmarkGroupToEdit = bookmarkGroups.find((group) => group.id === sourceID)?.bookmarks || []
			const orderedBookmarks: Bookmark[] = reorder(bookmarkGroupToEdit, source.index, destination.index)

			const newBookmarkData = {
				id: sourceID,
				title: bookmarkGroups.find((group) => group.id === sourceID)?.title || "",
				bookmarks: orderedBookmarks,
			}

			dispatch(editGroup(newBookmarkData))
		} else {
			const result: {
				[id: string | number]: Bookmark[]
			} = move(
				bookmarkGroups.find((group) => group.id === sourceID)?.bookmarks || [],
				bookmarkGroups.find((group) => group.id === destinationID)?.bookmarks || [],
				source,
				destination,
			)

			Object.keys(result).forEach((BookmarkID) => {
				console.log(BookmarkID)
				dispatch(
					editGroup({
						id: BookmarkID,
						title: bookmarkGroups.find((group) => group.id === BookmarkID)?.title || "",
						bookmarks: result[BookmarkID],
					}),
				)
			})
		}
	}

	return (
		<main>
			<DragDropContext onDragEnd={onDragEnd}>
				{bookmarkGroups.map((bookmarkData, index) => (
					<BookmarkGroupList
						key={bookmarkData.id}
						title={bookmarkData.title}
						initGroupId={bookmarkData.id}
					>
						<Droppable
							key={index}
							droppableId={bookmarkData.id}
							ignoreContainerClipping
						>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{bookmarkData.bookmarks.map((bookmark, index) => (
										<Draggable
											key={bookmark.id}
											draggableId={bookmark.id}
											index={index}
										>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<Bookmark
														key={bookmark.id}
														bookmark={bookmark}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</BookmarkGroupList>
				))}
			</DragDropContext>
		</main>
	)
}
