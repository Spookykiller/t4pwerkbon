class AnalyticsController < ApplicationController
    before_action :authenticate_user!
    
    def index
        redirect_to :back
        flash[:warning] = "Deze pagina is nog onder constructie."
    end
end
