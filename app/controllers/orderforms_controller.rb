class OrderformsController < ApplicationController
    before_action :authenticate_user!
    layout 'werkbonnen'
    before_action :find_orderform, only: [:nextstate, :print, :edit, :update, :destroy]
    before_action :find_order, only: [:index, :new, :create, :print, :nextstate, :edit, :update, :destroy]

    def index
        @orderforms = Orderform.where(:order => @order, :group_id => nil).order('werkbon_type ASC')
        # @backup_orderforms = Orderform.where(:order => @order, :group_id => nil, :backup => true).order('werkbon_type ASC')
    end
    
    def new
        @orderform = Orderform.new
        # leveranciers laden in volgorde van sequence_id (rijnummer)
        @leveranciers = Leverancier.all.order("sequence_id ASC")
    end
    
    def create
        @orderform = Orderform.new orderform_params
        @orderform.order = @order

        # status van de werkbon op offerte initialiseren
        @orderform.status = 0
        
        if @orderform.save
            flash[:notice] = "De werkbon is aangemaakt!"
            redirect_to order_orderforms_path(@order)
        else
            render 'new'
            flash[:alert] = "Oh nee! De werkbon is niet aangemaakt."
        end
    end
    
    def nextstate
        if (@orderform.status < 2) 
            # er wordt een backup gemaakt van het order formulier
            backup_orderform = @orderform.dup
            backup_orderform.backup = true
            backup_orderform.group_id = @orderform.id
            
            if backup_orderform.save
                # maak alle item attributen van de relaties van de werkbon aan in order van hun id's
                @orderform.items.order("id ASC").each do |item|
                    backup_orderform.items.create(item.dup.attributes)
                end
                
                # maak alle calculatie attributen van de relaties van de werkbon aan
                @orderform.calculations.order("id ASC").each do |calculation|
                    backup_orderform.calculations.create(calculation.dup.attributes)
                end
                            
                # orderforumlier gaat naar de volgende status
                newstate = (@orderform.status + 1)
                @orderform.update_attribute(:status, newstate)
                
                # redirect en toon notice van wijziging
                redirect_to order_orderforms_path(@order)
                flash[:notice] = "De status van werkbon #{@orderform.name} is geüpdate!"
            else
                # redirect en toon alert van fout
                redirect_to order_orderforms_path(@order)
                flash[:alert] = "Er is iets fout gegaan!"
            end
        else
            # laatste status bereikt. Zet orderform op backup.
            @orderform.update_attribute(:backup, true)

            redirect_to order_orderforms_path(@order)
            flash[:warning] = "Werkbon #{@orderform.name} heeft laatste status bereikt!"
        end
    end
    
    def print
    end
    
    def edit
    end
    
    def update

        if @orderform.update orderform_params
            flash[:notice] = "De werkbon is succesvol aangepast."
            redirect_to order_orderforms_path(@order)
        else
            flash[:notice] = "Oh nee! De werbon kon niet opgeslagen worden."
            render 'edit'
        end
    end
    
    def destroy
        @orderform.destroy
        redirect_to order_orderforms_path(@order)
    end
    
    private
    
    def orderform_params
        params.require(:orderform).permit(:group_id, :name, :backup, :manuren, :status, :organisatie, :datum, :werkvoorbereider, :oplevering, :werkbon_type, :totale_prijs, :totale_arbeid, :bijzonderheden, items_attributes: [:id, :regel_id, :hoeveelheid, :omschrijving, :var1, :var1_name, :var2, :var2_name, :var3, :var3_name, :var4, :var4_name, :article_prijs, :prijs, :totale_prijs, :werkbon_type, :_destroy], calculations_attributes: [:id, :werkbon, :ruimte, :aantal, :breedte, :hoogte, :pakket, :zijgeleiding, :contra_rolend, :strakke_hoogte_maat, :bmdm, :stuks, :hoofdje, :rail_lengte, :type_roede, :montage, :bediening, :montage_hoogte, :plaatsing, :bed, :raam_type, :uitlijnen, :knipmaat, :koof, :raam_montage, :bocht_type, :bocht_maat, :snijmaat, :ondervloer, :uitlijnen_met, :tuimelkoord, :raam_prijs, :ondergrond, :voorstrijken, :legrichting, :_destroy] )
    end
    
    def find_orderform
        @orderform = Orderform.find(params[:id]) 
    end
    
    def find_order
        @order = Order.find(params[:order_id])
    end

end
