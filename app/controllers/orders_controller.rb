class OrdersController < ApplicationController
    before_action :authenticate_user!
    layout 'werkbonnen'
    before_action :find_order, only: [:edit, :update, :destroy]
    helper_method :filtered_orders

    def index
        @orders = filtered_orders
        
        # @orders = Order.all
        
        # if params[:search]
        #     @orders = Order.search(params[:search]).order("created_at DESC")
        # else
        #     @orders = Order.order(sort_column + " " + sort_direction)
            # @orders = Order.joins(:order_states).group("orders.id").having('count(order_id) > 0')
        # end
    end
    
    def new
        @order = Order.new
    end
    
    def create
        @order = Order.new order_params

        if @order.save
            flash[:notice] = "De order is opgeslagen!"
            redirect_to action: "index"
        else
            render 'new'
            flash[:notice] = "Oh nee! De order is niet opgeslagen."
        end
    end
    
    def edit
    end
    
    def update
        if @order.update order_params
            flash[:notice] = "De order is succesvol aangepast."
            redirect_to action: "index"
        else
            flash[:notice] = "Oh nee! De order kon niet opgeslagen worden."
            render 'edit'
        end
    end
    
    def destroy
        @order.destroy
        redirect_to action: "index"
    end
    
    private
    
    def order_params
        params.require(:order).permit(:status, :naam, :project_nummer, :debtorid, :AdressLine1, :AdressLine3, :AdressLine4, :navigatie_adres, :telefoon, :email, :contactpersoon, :inmeetdatum, :ordernummer, :totale_prijs, :totale_arbeid, items_attributes: [:id, :voorraad_actie, :hoeveelheid, :omschrijving, :var1, :var1_name, :var2, :var2_name, :var3, :var3_name, :var4, :var4_name, :article_prijs, :prijs, :totale_prijs, :totale_arbeid, :werkbon_type, :_destroy], calculations_attributes: [:id, :werkbon, :ruimte, :breedte, :hoogte, :stuks, :bed, :voeren, :hoofdje, :bediening, :type, :uitlijnen, :bmdm, :_destroy] )
    end
    
    def find_order
        @order = Order.find(params[:id]) 
    end
    
    def filtered_orders
        
        # when filter is on all_werkbonnen all werkbonnen get showed up
        if params[:sort] == "yet_to_process_orderforms"
            #Order.orderforms.where(:backup => nil && :status < 2)
            Order.yet_to_process_orderforms
        elsif params[:sort] == "backup_orderforms"
            Order.backup_orderforms
        elsif params[:sort] == "empty_orderforms"
            Order.empty_orderforms
        else 
            Order.all.order('inmeetdatum ASC')
        end
    end
    
end
