$(document).ready(function () {
	///////////////////
	// Functions
	///////////////////
	function isEmpty(val) {
		return val === undefined || val == null || val.length <= 0 ? true : false
	}

	///////////////////////////////////////////////////////////////////////////
	// save the article to MongoDB (loading right after the scrape now)
	///////////////////////////////////////////////////////////////////////////
	$('.form-save-article').on('submit', function (event) {
		// Make sure to preventDefault on a submit event.
		event.preventDefault()

		var btnElement = $(document.activeElement)
		return
	})

	//////////////////////////////////
	// add the comment to an article
	//////////////////////////////////
	$('.form-save-comment').on('submit', function (event) {
		// Make sure to preventDefault on a submit event.
		event.preventDefault()

		const btnElement = $(document.activeElement)

		if (btnElement.attr('id') === 'btn-article-add-comment') {
			// get the data-id attribute from button
			const id = $(document.activeElement).data('id')

			// find the article id
			// const element = document.getElementById('comment-' + id)
			// const articleId = element.parentNode.getAttribute('data-article-id')

			const userName = $('#form-save-comment-' + id + ' [name=user_name]')
				.val()
				.trim()
			const comment = $('#form-save-comment-' + id + ' [name=comment]')
				.val()
				.trim()

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
				$.ajax('/comments/' + id, {
					type: 'POST',
					contentType: 'application/json',
					dataType: 'json',
					data: JSON.stringify(objComment),
					success: function (response) {
						// console.log('GOT the updated comment: ' + JSON.stringify(response))

						// clear the form and collapse it
						document.getElementById('form-save-comment-' + id).reset()
						// $('.collapse').collapse('hide');

						// update the number of comments
						const currentLength = $('#comment-length-' + id).text()
						$('#comment-length-' + id).text(parseInt(currentLength) + 1)

						///////////////////////////////////////
						// add the new comment to the page
						///////////////////////////////////////

						// add button element
						const element = $('#comment-area-' + id)

						$(element).append(
							"<div id='comment-" +
								response.comments[response.comments.length - 1] +
								"' class='comment-item m-2 p-2 rounded bg-light text-dark'>" +
								"<span class='comment-name text-info font-weight-bold px-1'>" +
								userName +
								'</span>' +
								"<span class='comment-text rounded p-2'>" +
								comment +
								'</span>' +
								"<button id='btnComment-" +
								response.comments[response.comments.length - 1] +
								"' type='button' class='delete-comment btn btn-light btn-circle float-right' data-id=" +
								response.comments[response.comments.length - 1] +
								"><i class='fa fa-times'></i></button>" +
								'</div>'
						)
					},
				})
			}
		} // end if
	})

	/////////////////////
	// delete the comment
	/////////////////////
	function handleCommentDelete(event) {
		console.log('in handleCommentDelete')

		// id is the article id here and not the comment id
		const id = $(this).data('id')
		const element = document.getElementById('comment-' + id)
		const articleId = element.parentNode.getAttribute('data-article-id')

		console.log('handleCommentDelete id: ', id)
		console.log('handleCommentDelete articleId: ', articleId)

		// Send the DELETE request.
		$.ajax('/comments/' + articleId + '/' + id, {
			type: 'DELETE',
		}).then(function () {
			console.log('deleted comment', id)

			// decrement the number of comments
			const currentLength = $('#comment-length-' + articleId).text()
			$('#comment-length-' + articleId).text(parseInt(currentLength) - 1)

			// remove the comment
			element.parentNode.removeChild(element)
		})
	}

	$('.comment-area').on('click', '.delete-comment', handleCommentDelete)
})
