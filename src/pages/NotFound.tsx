import { Fragment } from 'react'
import { Home, ArrowLeft } from 'lucide-react'
import CustomButton from '../components/global/Button'
import { ROUTES } from '../util/constants.util'

const NotFound = () => {
  return (
    <Fragment>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-[120px] md:text-[180px] font-bold text-[#03034D] leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0E0F0C] mb-4">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-[#454745] font-normal max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-8 sm:flex-row gap-4 justify-center items-center w-full">
            <CustomButton
              variant="link"
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </CustomButton>

            <CustomButton
              onClick={() => window.history.back()}
              className="!flex !items-center !justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </CustomButton>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NotFound

