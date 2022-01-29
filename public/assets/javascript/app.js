const ALERT_MSG_TIME = 5000

////////////////////////
// event handlers
////////////////////////

// add a comment to an article
function handleCommentFormSubmit(e) {
	e.preventDefault()

	if (e.target.classList.contains('form-save-comment')) {
		const btnElement = document.activeElement

		if (btnElement.getAttribute('id') === 'btn-article-add-comment') {
			const id = btnElement.getAttribute('data-id')

			const userName = document
				.querySelector(`#form-save-comment-${id} [name=user_name]`)
				.value.trim()
			const comment = document
				.querySelector(`#form-save-comment-${id} [name=comment]`)
				.value.trim()

			if (isEmpty(userName) || isEmpty(comment)) {
				return false
			} else {
				// form field checks
				const objComment = {
					articleId: id,
					userName: userName,
					comment: comment,
				}

				// Send the POST request.
				fetch(`/api/articles/comments/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(objComment),
				})
					.then((response) => response.json())
					.then((data) => {
						// clear the form
						document.getElementById('form-save-comment-' + id).reset()

						// increment the number of comments
						const commentLengthEl = document.querySelector(
							`#comment-length-${id}`
						)
						commentLengthEl.innerText = parseInt(commentLengthEl.innerText) + 1

						// add the new comment to the page
						const element = document.querySelector(`#comment-area-${id}`)
						element.innerHTML += `<div id='comment-${
							data.comments[data.comments.length - 1]
						}' class='comment-item m-2 p-2 rounded bg-light text-dark d-flex'> 
							 <span class='comment-name text-info font-weight-bold px-1'>${userName}</span>
							 <span class='comment-text rounded px-2 flex-grow-1'>${comment}</span>
							 <button id='btnComment-${
									data.comments[data.comments.length - 1]
								}' type='button' class='delete-comment btn btn-light btn-adjust py-0' data-id=${
							data.comments[data.comments.length - 1]
						}><i class='fa fa-times'></i></button>
							</div>`

						// get the collapsing element so we can resize after new element is added
						const collapsingEl = btnElement
							.closest('.card-body')
							.querySelector('.collapse')

						// resize
						forceMasonryToResize(collapsingEl)

						// set the focus
						btnElement
							.closest('.card-body')
							.querySelector('#comment_update')
							.focus()
					})
					.catch((error) => {
						console.error('Error:', error)
					})
			}
		} // end if
	}
}

// handle clicked events on articles
function handleArticlesClick(e) {
	// e.preventDefault()

	// FOCUS COMMENT if target is the comment button or the icon in it
	if (
		e.target &&
		(e.target.matches("button[data-bs-toggle='collapse']") ||
			e.target.matches('.far.fa-comments'))
	) {
		// give focus to comment entry when toggle comment area
		event.target.closest('.card-body').querySelector('#comment_update').focus()
	}

	// DELETE COMMENT from an article
	if (e.target && e.target.parentNode.classList.contains('delete-comment')) {
		const commentId = e.target.parentNode.getAttribute('data-id')
		const element = document.getElementById('comment-' + commentId)
		const articleId = element.parentNode.getAttribute('data-article-id')

		// Send the DELETE request.
		fetch(`/api/articles/comments/${articleId}/${commentId}`, {
			method: 'DELETE',
		}).then(function () {
			// get the current number of comments
			const commentLengthEl = document.querySelector(
				`#comment-length-${articleId}`
			)

			// set the decremented count
			commentLengthEl.innerText = parseInt(commentLengthEl.innerText) - 1

			// remove the comment
			element.parentNode.removeChild(element)

			// get the collapsing element so we can resize because a comment has been deleted
			const collapsingEl = commentLengthEl
				.closest('.card-body')
				.querySelector('.collapse')

			//resize
			forceMasonryToResize(collapsingEl)

			// set the focus
			commentLengthEl
				.closest('.card-body')
				.querySelector('#comment_update')
				.focus()
		})
	}
}

// once the DOM loads, initialize
function handleAppLoad() {
	const articlesEl = document.querySelector('#articles')

	if (articlesEl !== null) {
		document.addEventListener('submit', handleCommentFormSubmit)

		articlesEl.addEventListener('click', handleArticlesClick)

		// e.target is the element being for the bootstrap shown and hidden events collapse
		articlesEl.addEventListener('shown.bs.collapse', (e) => {
			forceMasonryToResize(e.target)
		})
		articlesEl.addEventListener('hidden.bs.collapse', (e) => {
			forceMasonryToResize(e.target)
		})
	}

	// show messages 5 seconds
	setTimeout(() => {
		let alertNodes = document.querySelectorAll('.alert')
		alertNodes.forEach((node) => {
			const alert = new bootstrap.Alert(node)
			alert.close()
		})
	}, ALERT_MSG_TIME)
}

////////////////////////
// functions
////////////////////////

// check for empty, null or undefined
function isEmpty(val) {
	return val === undefined || val == null || val.length <= 0 ? true : false
}

function forceMasonryToResize(el) {
	void el.offsetHeight
	msnry.layout()
}

////////////////////////
// app load
////////////////////////

let msnry = null

if (document.getElementById('articles')) {
	// Masonry layout
	// --> html equivalent is on .row with data-masonry='{"percentPosition": true,"itemSelector": ".col" }'
	let masonryContainer = '#articles.row'
	let masonryItem = '.col'
	msnry = new Masonry(masonryContainer, {
		itemSelector: masonryItem,
		percentPosition: true,
	})
}

if (document.readyState == 'loading') {
	// still loading, wait for the event
	document.addEventListener('DOMContentLoaded', handleAppLoad)
} else {
	// DOM is ready!
	handleAppLoad()
}
