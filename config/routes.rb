Rails.application.routes.draw do
  root :to => 'home#index'
  mount ShopifyApp::Engine, at: '/'

  get '/products/most_ordered', to: 'products#most_ordered'
end
