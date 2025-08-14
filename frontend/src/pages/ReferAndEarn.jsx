import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Copy, Share2, Gift, Users, DollarSign } from 'lucide-react';

const ReferAndEarn = () => {
  const { user } = useContext(AppContext);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/login?ref=${user?.referralCode}`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Winners Club - Fantasy Sports',
        text: `Use my referral code ${user?.referralCode} and get 3% bonus on your first deposit!`,
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-6 px-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Refer & Earn</h1>
            <p className="text-gray-300 mt-1">Share and earn rewards</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Gift className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-800 leading-none">{user?.totalReferrals || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Est. Earnings</p>
                <p className="text-2xl font-bold text-gray-800 leading-none">₹{((user?.totalReferrals || 0) * 0).toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Referral Code</h3>
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600 tracking-wider mb-2">
                {user?.referralCode || 'Loading...'}
              </p>
              <button
                onClick={copyReferralCode}
                className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share with Friends</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copyReferralLink}
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={shareReferral}
              className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-3 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How Refer & Earn Works</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-gray-800">Share your referral code</p>
                <p className="text-sm text-gray-600">Send your unique code to friends</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-gray-800">Friend signs up & deposits</p>
                <p className="text-sm text-gray-600">They get 3% bonus on every deposit</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-gray-800">You earn rewards</p>
                <p className="text-sm text-gray-600">Get bonus when they make deposits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Terms</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Friends get 3% bonus on every deposit when using your code</li>
            <li>• You earn rewards when referred friends make deposits</li>
            <li>• Minimum deposit of ₹100 required to activate bonus</li>
            <li>• Bonus will be credited within 24 hours</li>
          </ul>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default ReferAndEarn;