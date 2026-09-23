"""Keep the fault verifier's caller-output assertions independent."""

import json
import unittest

from proxy import verify_wizard_faults as verifier


RESULT = {
    'outcome': 'failed',
    'code': 'PHW_AGENT_API_ERROR',
    'message': 'API Error\n\nSynthetic Wizard proxy fault',
    'hasError': True,
}


def result_marker(result=RESULT):
    return 'WIZARD_FAULT_RESULT ' + json.dumps(result) + '\n'


def structured_error(result=RESULT):
    return 'phw-error: ' + json.dumps({
        'code': result['code'], 'message': result['message']}) + '\n'


class CallerOutputTest(unittest.TestCase):
    def test_marker_alone_cannot_prove_caller_output(self):
        with self.assertRaises(AssertionError):
            verifier.caller_evidence(result_marker(), '', RESULT, 'anthropic')

    def test_machine_error_must_match_result(self):
        for mismatch in (
            {'code': 'PHW_AUTH_INVALID_OR_EXPIRED'},
            {'message': 'A different failure'},
        ):
            with self.subTest(mismatch=mismatch):
                with self.assertRaisesRegex(AssertionError, 'phw-error differs'):
                    verifier.caller_evidence(
                        result_marker() + f'✖  {RESULT["message"]}\n',
                        structured_error({**RESULT, **mismatch}), RESULT,
                        'anthropic')

    def test_missing_machine_error_is_rejected(self):
        with self.assertRaisesRegex(AssertionError, 'phw-error line on stderr'):
            verifier.caller_evidence(
                result_marker() + f'✖  {RESULT["message"]}\n',
                '', RESULT, 'anthropic')

    def test_renderer_must_write_to_stdout(self):
        with self.assertRaises(AssertionError):
            verifier.caller_evidence(result_marker(), structured_error(), RESULT, 'anthropic')

    def test_valid_independent_outputs_and_optional_error(self):
        stdout = result_marker() + f'✖  {RESULT["message"]}\n'
        evidence = verifier.caller_evidence(
            stdout, structured_error(), RESULT, 'anthropic')
        self.assertTrue(evidence['headlessErrorShown'])
        self.assertEqual(evidence['machineError']['code'], RESULT['code'])
        pi_result = {**RESULT, 'hasError': False}
        verifier.caller_evidence(
            result_marker(pi_result) + f'✖  {pi_result["message"]}\n',
            structured_error(pi_result), pi_result, 'pi')
        with self.assertRaises(AssertionError):
            verifier.caller_evidence(stdout, structured_error(), pi_result, 'anthropic')


if __name__ == '__main__':
    unittest.main()
