Rails.application.routes.draw do
  devise_for :users
  
  resources :orders, except: :show do
    resources :orderforms, except: :show do
      member do
        get 'nextstate'
        get 'print'
      end
    end
  end
  
  resources :regels, except: :show do
    member do
      get 'duplicate'
    end
  end
  
  resources :leveranciers, except: :show
  resources :articles, except: :show
  get 'regels/new_blanko'
  
  resources :analytics, only: [:index, :show]
  
  root 'orders#index'
end
