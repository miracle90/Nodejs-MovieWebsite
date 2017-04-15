// 删除逻辑
$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id
		})
		.done(function(results) {
			console.log(results);
			if (results.success === 1) {
				if (tr.length > 0) {
					console.log(1);
					tr.remove();
				}
			}
		})
	})
})