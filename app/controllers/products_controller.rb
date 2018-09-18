class ProductsController < ShopifyApp::AuthenticatedController
	def most_ordered
		render json: (most_ordered_products.map do |product_orders|
			{
				product: {
					id: product_orders[:product].id,
					title: product_orders[:product].title,
					link: "https://#{@shop_session.url}/admin/products/#{product_orders[:product].id}",
					image: product_orders[:product].image.try(:src)
				},
				count: product_orders[:count]
			}
		end)
	end

	private

	def most_ordered_products
		@most_ordered_products ||= sorted_ordered_products[0, most_ordered_params[:count].to_i].map do |product_orders| 
			{
				product: ShopifyAPI::Product.find(product_orders[:product_id]),
				count: product_orders[:count]
			}
		end
	end

	def sorted_ordered_products
		@sorted_ordered_products ||= date_ordered_products.sort_by { |product_orders| product_orders[:count] }.reverse
	end

	def date_orders
		@date_orders ||= ShopifyAPI::Order.find(
			:all,
			params: {
				processed_at_min: most_ordered_params[:date].to_date.beginning_of_day,
				processed_at_max: most_ordered_params[:date].to_date.end_of_day
			})
	end

	def date_line_items
		@date_line_items ||= date_orders.map(&:line_items).flatten
	end

	def date_ordered_products
		date_line_items.group_by(&:product_id).map do |product_id, line_items|
			{
				product_id: product_id,
				count: line_items.sum(&:quantity)
			}
		end
	end

	def most_ordered_params
		params.permit(:count, :date)
	end
end
